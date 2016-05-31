<?php
namespace Avatar4eg\Countries\Api\Serializer;

use Flarum\Tags\Api\Serializer\TagSerializer;

class CountrySerializer extends CountryBasicSerializer
{
    /**
     * @return \Tobscure\JsonApi\Relationship
     */
    protected function tag($country)
    {
        return $this->hasOne($country, TagSerializer::class);
    }

    /**
     * @return \Tobscure\JsonApi\Relationship
     */
    protected function personalTag($country)
    {
        return $this->hasOne($country, TagSerializer::class);
    }

    /**
     * @return \Tobscure\JsonApi\Relationship
     */
    protected function related($country)
    {
        return $this->hasMany($country, CountryBasicSerializer::class);
    }
}
