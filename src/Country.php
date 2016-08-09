<?php
namespace Avatar4eg\Countries;

use Flarum\Database\AbstractModel;
use Flarum\Tags\Tag;

/**
 * @property int $id
 * @property string $iso
 * @property string $title
 * @property string $img
 * @property string $description
 * @property int $tag_id
 * @property int $personal_tag_id
 */
class Country extends AbstractModel
{
    /**
     * {@inheritdoc}
     */
    protected $table = 'avatar4eg_countries';

    /**
     * Create a new country.
     *
     * @param string $title
     * @param string $iso
     * @param string $img
     * @param string $description
     * @param int $tag_id
     * @param int $personal_tag_id
     * @return static
     */
    public static function build($title, $iso, $img = null, $description = null, $tag_id = null, $personal_tag_id = null)
    {
        $country = new static;

        $country->title             = $title;
        $country->iso               = $iso;
        $country->img               = $img;
        $country->description       = $description;
        $country->tag_id            = $tag_id;
        $country->personal_tag_id   = $personal_tag_id;

        return $country;
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function tag()
    {
        return $this->belongsTo(Tag::class, 'tag_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function personalTag()
    {
        return $this->belongsTo(Tag::class, 'personal_tag_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function related()
    {
        return $this->belongsToMany(Country::class, 'avatar4eg_related_countries', 'country_a_id', 'country_b_id');
    }
}
