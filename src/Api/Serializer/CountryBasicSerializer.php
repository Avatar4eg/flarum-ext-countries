<?php
namespace Avatar4eg\Countries\Api\Serializer;

use Avatar4eg\Countries\Country;
use Flarum\Api\Serializer\AbstractSerializer;
use Flarum\Core\Access\Gate;
use InvalidArgumentException;

class CountryBasicSerializer extends AbstractSerializer
{
    /**
     * {@inheritdoc}
     */
    protected $type = 'countries';

    /**
     * {@inheritdoc}
     *
     * @param Country $country
     * @throws InvalidArgumentException
     */
    protected function getDefaultAttributes($country)
    {
        if (! ($country instanceof Country)) {
            throw new InvalidArgumentException(get_class($this)
                . ' can only serialize instances of ' . Country::class);
        }

        $attributes = [
            'id'                => $country->id,
            'iso'               => $country->iso,
            'title'             => $country->title,
            'img'               => $country->img,
            'description'       => $country->description
        ];

        return $attributes;
    }
}
