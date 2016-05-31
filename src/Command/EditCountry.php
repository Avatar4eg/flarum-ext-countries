<?php
namespace Avatar4eg\Countries\Command;

use Flarum\Core\User;

class EditCountry
{
    /**
     * The ID of the country to edit.
     *
     * @var int
     */
    public $countryId;

    /**
     * The user performing the action.
     *
     * @var User
     */
    public $actor;

    /**
     * The attributes to update on the country.
     *
     * @var array
     */
    public $data;

    /**
     * @param int $countryId The ID of the country to edit.
     * @param User $actor The user performing the action.
     * @param array $data The attributes to update on the country.
     */
    public function __construct($countryId, User $actor, array $data)
    {
        $this->countryId = $countryId;
        $this->actor = $actor;
        $this->data = $data;
    }
}
