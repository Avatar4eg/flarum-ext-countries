<?php
namespace Avatar4eg\Countries\Api\Controller;

use Avatar4eg\Countries\Api\Serializer\CountrySerializer;
use Avatar4eg\Countries\Repository\CountryRepository;
use Flarum\Api\UrlGenerator;
use Flarum\Api\Controller\AbstractCollectionController;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class ListCountriesController extends AbstractCollectionController
{
    /**
     * {@inheritdoc}
     */
    public $serializer = CountrySerializer::class;

    /**
     * {@inheritdoc}
     */
    public $include = [
        'tag',
        'personalTag',
        'related'
    ];

    /**
     * @var CountryRepository
     */
    private $countries;

    /**
     * @var UrlGenerator
     */
    protected $url;

    /**
     * @param CountryRepository $countries
     */
    public function __construct(CountryRepository $countries, UrlGenerator $url)
    {
        $this->countries = $countries;
        $this->url = $url;
    }

    /**
     * {@inheritdoc}
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $filter = $this->extractFilter($request);
        $include = $this->extractInclude($request);
        $where = [];

        $sort = $this->extractSort($request);
        $limit = $this->extractLimit($request);
        $offset = $this->extractOffset($request);

        if ($postIds = array_get($filter, 'id')) {
            $countries = $this->countries->findByIds(explode(',', $postIds));
        } else {
            if ($search = array_get($filter, 'search')) {
                $countries = $this->countries->searchByTitleIso($search, $sort, $limit, $offset);
            } else {
                if ($tagId = array_get($filter, 'tag')) {
                    $where['tag_id'] = $tagId;
                }
                $countries = $this->countries->findWhere($where, $sort, $limit, $offset);
            }
        }

        $total = $this->countries->query()->count();

        $document->addPaginationLinks(
            $this->url->toRoute('avatar4eg.countries.index'),
            $request->getQueryParams(),
            $offset,
            $limit,
            $total
        );

        return $countries->load($include);
    }
}
