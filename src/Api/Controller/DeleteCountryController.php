<?php
namespace Avatar4eg\Countries\Api\Controller;

use Flarum\Api\Controller\AbstractDeleteController;
use Avatar4eg\Countries\Command\DeleteCountry;
use Illuminate\Contracts\Bus\Dispatcher;
use Psr\Http\Message\ServerRequestInterface;

class DeleteCountryController extends AbstractDeleteController
{
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
    protected function delete(ServerRequestInterface $request)
    {
        $this->bus->dispatch(
            new DeleteCountry(array_get($request->getQueryParams(), 'id'), $request->getAttribute('actor'))
        );
    }
}
