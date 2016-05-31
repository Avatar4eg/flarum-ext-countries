<?php
namespace Avatar4eg\Countries\Migration;

use Flarum\Database\Migration;
use Illuminate\Database\Schema\Blueprint;

return Migration::createTable(
    'avatar4eg_countries',
    function (Blueprint $table) {
        $table->increments('id');
        $table->string('iso', 2);
        $table->string('title', 100);
        $table->string('img')->nullable();
        $table->text('description')->nullable();
        $table->integer('tag_id')->nullable();
        $table->integer('personal_tag_id')->nullable();
    }
);
