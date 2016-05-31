import Country from 'avatar4eg/countries/models/Country';
import addCountriesPane from 'avatar4eg/countries/addCountriesPane';

app.initializers.add('avatar4eg-countries', app => {
    app.store.models.countries = Country;
    addCountriesPane();
});
