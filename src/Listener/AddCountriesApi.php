<?php
namespace Avatar4eg\Countries\Listener;

use Avatar4eg\Countries\Api\Controller\ListCountriesController;
use Avatar4eg\Countries\Api\Controller\ShowCountryController;
use Avatar4eg\Countries\Api\Controller\CreateCountryController;
use Avatar4eg\Countries\Api\Controller\UpdateCountryController;
use Avatar4eg\Countries\Api\Controller\DeleteCountryController;
use Flarum\Event\ConfigureApiRoutes;
use Illuminate\Events\Dispatcher;

class AddCountriesApi
{
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureApiRoutes::class, [$this, 'configureApiRoutes']);
    }

    public function configureApiRoutes(ConfigureApiRoutes $event)
    {
        $event->get('/countries', 'avatar4eg.countries.index', ListCountriesController::class);
        $event->get('/countries/{iso}', 'avatar4eg.countries.get', ShowCountryController::class);
        $event->post('/countries', 'avatar4eg.countries.create', CreateCountryController::class);
        $event->patch('/countries/{id}', 'avatar4eg.countries.update', UpdateCountryController::class);
        $event->delete('/countries/{id}', 'avatar4eg.countries.delete', DeleteCountryController::class);
    }
}
