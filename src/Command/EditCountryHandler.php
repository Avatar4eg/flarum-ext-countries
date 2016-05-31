<?php
namespace Avatar4eg\Countries\Command;

use Avatar4eg\Countries\Country;
use Flarum\Core\Access\AssertPermissionTrait;
use Avatar4eg\Countries\Repository\CountryRepository;
use Avatar4eg\Countries\Validator\CountryValidator;
use Flarum\Foundation\Application;
use Illuminate\Support\Str;
use League\Flysystem\Adapter\Local;
use League\Flysystem\Filesystem;
use League\Flysystem\MountManager;

class EditCountryHandler
{
    use AssertPermissionTrait;

    /**
     * @var CountryRepository
     */
    protected $countries;

    /**
     * @var Filesystem
     */
    protected $uploadDir;

    /**
     * @var string
     */
    protected $uploadDirString = '/assets/countries';

    /**
     * @var Application
     */
    protected $app;

    /**
     * @var CountryValidator
     */
    protected $validator;

    /**
     * @param CountryRepository $countries
     * @param Application $app
     * @param CountryValidator $validator
     */
    public function __construct(CountryRepository $countries, Application $app, CountryValidator $validator)
    {
        $this->countries = $countries;
        $this->app = $app;
        $this->uploadDir = new Filesystem(new Local($this->app->publicPath() . $this->uploadDirString));
        $this->validator = $validator;
    }

    /**
     * @param EditCountry $command
     * @return Country
     * @throws \Flarum\Core\Exception\PermissionDeniedException
     */
    public function handle(EditCountry $command)
    {
        $actor = $command->actor;
        $data = $command->data;

        $country = $this->countries->findOrFail($command->countryId, $actor);

        $this->assertAdmin($actor);

        $attributes = array_get($data, 'attributes', []);

        if (isset($attributes['title'])) $country->title = $attributes['title'];
        if (isset($attributes['iso'])) $country->iso = $attributes['iso'];
        if (isset($attributes['img']) && $country->img !== $attributes['img']) {
            if(filter_var($attributes['img'], FILTER_VALIDATE_URL)) {
                $country->img = $attributes['img'];
            } else {
                $tmpFile = tempnam($this->app->storagePath() . '/tmp', 'country');
                $data = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $attributes['img']));
                file_put_contents($tmpFile, $data);

                $mount = new MountManager([
                    'source' => new Filesystem(new Local(pathinfo($tmpFile, PATHINFO_DIRNAME))),
                    'target' => $this->uploadDir,
                ]);

                if ($country->img && $mount->has($file = "target://" . str_replace($this->uploadDirString . '/', '', $country->img))) {
                    $mount->delete($file);
                }

                $uploadName = Str::lower(Str::quickRandom()) . '.jpg';
                $country->img = $this->uploadDirString . '/' . $uploadName;
                $mount->move('source://' . pathinfo($tmpFile, PATHINFO_BASENAME), "target://$uploadName");
            }
        }
        if (isset($attributes['description'])) $country->description = $attributes['description'];
        if (isset($attributes['tag_id'])) $country->tag_id = $attributes['tag_id'];
        if (isset($attributes['personal_tag_id'])) $country->personal_tag_id = $attributes['personal_tag_id'];

        $this->validator->assertValid($country->getDirty());

        $country->save();

        return $country;
    }
}
