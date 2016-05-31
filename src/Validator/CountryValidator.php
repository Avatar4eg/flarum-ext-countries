<?php
namespace Avatar4eg\Countries\Validator;

use Flarum\Core\Validator\AbstractValidator;

class CountryValidator extends AbstractValidator
{
    /**
     * {@inheritdoc}
     */
    protected $rules = [
        'title' => ['required'],
        'iso'   => ['required']
    ];
}
