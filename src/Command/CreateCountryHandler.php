<?php
namespace Avatar4eg\Countries\Command;

use Flarum\Core\Access\AssertPermissionTrait;
use Avatar4eg\Countries\Country;
use Avatar4eg\Countries\Validator\CountryValidator;
use Flarum\Foundation\Application;
use Illuminate\Support\Str;
use League\Flysystem\Adapter\Local;
use League\Flysystem\Filesystem;
use League\Flysystem\MountManager;

class CreateCountryHandler
{
    use AssertPermissionTrait;

    /**
     * @var CountryValidator
     */
    protected $validator;

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
     * @param CountryValidator $validator
     */
    public function __construct(CountryValidator $validator, Application $app)
    {
        $this->validator = $validator;
        $this->app = $app;
        $this->uploadDir = new Filesystem(new Local($this->app->publicPath() . $this->uploadDirString));
    }

    /**
     * @param CreateCountry $command
     * @return Country
     */
    public function handle(CreateCountry $command)
    {
        $actor = $command->actor;
        $data = $command->data;

        $this->assertAdmin($actor);

        $img = array_get($data, 'attributes.img');
        if (isset($img)) {
            if(!filter_var($img, FILTER_VALIDATE_URL)) {
                $tmpFile = tempnam($this->app->storagePath() . '/tmp', 'country');
                $fileData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $img));
                file_put_contents($tmpFile, $fileData);

                $mount = new MountManager([
                    'source' => new Filesystem(new Local(pathinfo($tmpFile, PATHINFO_DIRNAME))),
                    'target' => $this->uploadDir,
                ]);

                $uploadName = Str::lower(Str::quickRandom()) . '.jpg';
                $img = $this->uploadDirString . '/' . $uploadName;
                $mount->move('source://' . pathinfo($tmpFile, PATHINFO_BASENAME), "target://$uploadName");
            }
        }

        $country = Country::build(
            array_get($data, 'attributes.title'),
            array_get($data, 'attributes.iso'),
            $img,
            array_get($data, 'attributes.description'),
            array_get($data, 'attributes.tag_id'),
            array_get($data, 'attributes.personal_tag_id')
        );

        $this->validator->assertValid($country->getAttributes());

        $country->save();

        return $country;
    }
}
