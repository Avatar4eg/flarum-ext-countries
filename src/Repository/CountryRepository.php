<?php
namespace Avatar4eg\Countries\Repository;

use Avatar4eg\Countries\Country;
use Flarum\Core\User;

class CountryRepository
{
    public function query()
    {
        return Country::query();
    }

    /**
     * Find a country by ISO 3166-1 alpha-2
     *
     * @param int $iso
     * @param User $actor
     * @return Country
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function findOrFail($iso, User $actor = null)
    {
        return Country::where('iso', $iso)
            ->orWhere('id', $iso)
            ->firstOrFail();
    }

    /**
     * @param array $where
     * @param array $sort
     * @param integer $count
     * @param integer $start
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function findWhere(array $where = [], $sort = [], $count = null, $start = 0)
    {
        $query = Country::where($where)
            ->skip($start)
            ->take($count);

        foreach ((array) $sort as $field => $order) {
            $query->orderBy($field, $order);
        }

        $ids = $query->lists('id')->all();

        return $this->findByIds($ids);
    }

    /**
     * @param string $search
     * @param array $sort
     * @param integer $count
     * @param integer $start
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function searchByTitleIso($search = '', $sort = [], $count = null, $start = 0)
    {
        $query = Country::where('title', 'LIKE', "%$search%")
            ->orWhere('iso', 'LIKE', "%$search%")
            ->skip($start)
            ->take($count);

        foreach ((array) $sort as $field => $order) {
            $query->orderBy($field, $order);
        }

        $ids = $query->lists('id')->all();

        return $this->findByIds($ids);
    }

    /**
     * @param string $search
     * @param array $sort
     * @param integer $count
     * @param integer $start
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getRandom($search = '', $sort = [], $count = null, $start = 0)
    {
        $query = Country::where('title', 'LIKE', "%$search%")
            ->orWhere('iso', 'LIKE', "%$search%")
            ->skip($start)
            ->take($count);

        foreach ((array) $sort as $field => $order) {
            $query->orderBy($field, $order);
        }

        $ids = $query->lists('id')->all();

        return $this->findByIds($ids);
    }

    /**
     * @param array $ids
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function findByIds(array $ids)
    {
        $countries = Country::whereIn('id', $ids)->get();

        $countries = $countries->sort(function ($a, $b) use ($ids) {
            $aPos = array_search($a->id, $ids, false);
            $bPos = array_search($b->id, $ids, false);

            if ($aPos === $bPos) {
                return 0;
            }

            return $aPos < $bPos ? -1 : 1;
        });

        return $countries;
    }

    /**
     * Get all countries
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function all()
    {
        return Country::newQuery();
    }
}
