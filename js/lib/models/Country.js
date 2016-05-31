import Model from 'flarum/Model';
import mixin from 'flarum/utils/mixin';

export default class Country extends mixin(Model, {
    iso: Model.attribute('iso'),
    title: Model.attribute('title'),
    img: Model.attribute('img'),
    description: Model.attribute('description'),
    tag: Model.hasOne('tag'),
    personalTag: Model.hasOne('personalTag'),
    related: Model.hasMany('related')
}) {}
