<?php
namespace Avatar4eg\Countries\Command;

use Flarum\Core\User;

class DeleteCountry
{
    /**
     * The ID of the country to delete.
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
     * Any other country input associated with the action. This is unused by
     * default, but may be used by extensions.
     *
     * @var array
     */
    public $data;

    /**
     * @param int $countryId The ID of the country to delete.
     * @param User $actor The user performing the action.
     * @param array $data Any other country input associated with the action. This
     *     is unused by default, but may be used by extensions.
     */
    public function __construct($countryId, User $actor, array $data = [])
    {
        $this->countryId = $countryId;
        $this->actor = $actor;
        $this->data = $data;
    }
}
