<?php
namespace Avatar4eg\Countries\Api\Controller;

use Avatar4eg\Countries\Api\Serializer\CountrySerializer;
use Avatar4eg\Countries\Repository\CountryRepository;
use Flarum\Api\Controller\AbstractResourceController;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class ShowCountryController extends AbstractResourceController
{
    /**
     * @inheritdoc
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
    protected $countries;

    public function __construct(CountryRepository $countries)
    {
        $this->countries = $countries;
    }

    /**
     * {@inheritdoc}
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        return $this->countries->findOrFail(array_get($request->getQueryParams(), 'iso'), $request->getAttribute('actor'));
    }
}
