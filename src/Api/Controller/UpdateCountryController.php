<?php
namespace Avatar4eg\Countries\Api\Controller;

use Flarum\Api\Controller\AbstractResourceController;
use Avatar4eg\Countries\Api\Serializer\CountrySerializer;
use Avatar4eg\Countries\Command\EditCountry;
use Illuminate\Contracts\Bus\Dispatcher;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class UpdateCountryController extends AbstractResourceController
{
    /**
     * @inheritdoc
     */
    public $serializer = CountrySerializer::class;

    /**
     * @var Dispatcher
     */
    protected $bus;

    /**
     * @param Dispatcher $bus
     */
    public function __construct(Dispatcher $bus)
    {
        $this->bus = $bus;
    }

    /**
     * {@inheritdoc}
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $id = array_get($request->getQueryParams(), 'id');
        $actor = $request->getAttribute('actor');
        $data = array_get($request->getParsedBody(), 'data');

        return $this->bus->dispatch(
            new EditCountry($id, $actor, $data)
        );
    }
}
