<?php
namespace Avatar4eg\Countries\Migration;

use Flarum\Database\Migration;
use Illuminate\Database\Schema\Blueprint;

return Migration::createTable(
    'avatar4eg_related_countries',
    function (Blueprint $table) {
        $table->integer('country_a_id')->unsigned();
        $table->integer('country_b_id')->unsigned();
        $table->primary(['country_a_id', 'country_b_id']);
    }
);
