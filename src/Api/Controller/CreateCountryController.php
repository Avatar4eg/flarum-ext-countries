<?php
namespace Avatar4eg\Countries\Api\Controller;

use Flarum\Api\Controller\AbstractCreateController;
use Avatar4eg\Countries\Api\Serializer\CountrySerializer;
use Avatar4eg\Countries\Command\CreateCountry;
use Illuminate\Contracts\Bus\Dispatcher;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class CreateCountryController extends AbstractCreateController
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
        return $this->bus->dispatch(
            new CreateCountry($request->getAttribute('actor'), array_get($request->getParsedBody(), 'data'))
        );
    }
}
