<?php
namespace Avatar4eg\Countries\Command;

use Avatar4eg\Countries\Country;
use Flarum\Core\Access\AssertPermissionTrait;
use Avatar4eg\Countries\Repository\CountryRepository;

class DeleteCountryHandler
{
    use AssertPermissionTrait;

    /**
     * @var CountryRepository
     */
    protected $countries;

    /**
     * @param CountryRepository $countries
     */
    public function __construct(CountryRepository $countries)
    {
        $this->countries = $countries;
    }

    /**
     * @param DeleteCountry $command
     * @return Country
     * @throws \Flarum\Core\Exception\PermissionDeniedException
     */
    public function handle(DeleteCountry $command)
    {
        $actor = $command->actor;

        $country = $this->countries->findOrFail($command->countryId, $actor);

        $this->assertAdmin($actor);

        $country->delete();

        return $country;
    }
}
