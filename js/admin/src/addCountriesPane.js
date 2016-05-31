import { extend } from 'flarum/extend';
import AdminNav from 'flarum/components/AdminNav';
import AdminLinkButton from 'flarum/components/AdminLinkButton';

import CountriesPage from 'avatar4eg/countries/components/CountriesPage';

export default function() {
  app.routes.countries = {path: '/countries', component: CountriesPage.component()};

  app.extensionSettings['avatar4eg-countries'] = () => m.route(app.route('countries'));

  extend(AdminNav.prototype, 'items', items => {
    items.add('countries', AdminLinkButton.component({
      href: app.route('countries'),
      icon: 'globe',
      children: app.translator.trans('avatar4eg-countries.admin.nav.countries_button'),
      description: app.translator.trans('avatar4eg-countries.admin.nav.countries_text')
    }));
  });
}
