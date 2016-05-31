import Page from 'flarum/components/Page';
import Button from 'flarum/components/Button';
import LoadingIndicator from 'flarum/components/LoadingIndicator';

import EditCountryModal from 'avatar4eg/countries/components/EditCountryModal';

function CountryItem(country) {
    return [
        m('li', {"data-id": country.id()}, [
            m('div', {className: 'CountryListItem-info'}, [
                m('span', {className: 'CountryListItem-name'}, [
                    country.id(),
                    '. ',
                    country.title()
                ]),
                Button.component({
                    className: 'Button Button--link',
                    icon: 'pencil',
                    onclick: () => app.modal.show(new EditCountryModal({country}))
                })
            ])
        ])
    ];
}

export default class CountriesPage extends Page {
    init() {
        super.init();

        this.loading = true;
        this.moreResults = false;
        this.countries = [];
        this.refresh();
    }

    view() {
        let loading;

        if (this.loading) {
            loading = LoadingIndicator.component();
        } else if (this.moreResults) {
            loading = Button.component({
                children: app.translator.trans('avatar4eg-countries.admin.countries.load_more_button'),
                className: 'Button',
                onclick: this.loadMore.bind(this)
            });
        }

        return [
            m('div', {className: 'CountriesPage'}, [
                m('div', {className: 'CountriesPage-header'}, [
                    m('div', {className: 'container'}, [
                        m('p', {}, app.translator.trans('avatar4eg-countries.admin.countries.about_text')),
                        Button.component({
                            className: 'Button Button--primary',
                            icon: 'plus',
                            children: app.translator.trans('avatar4eg-countries.admin.countries.create_button'),
                            onclick: () => app.modal.show(new EditCountryModal())
                        })
                    ])
                ]),
                m('div', {className: 'CountriesPage-list'}, [
                    m('div', {className: 'container'}, [
                        m('div', {className: 'CountryItems'}, [
                            m('label', {}, app.translator.trans('avatar4eg-countries.admin.countries.countries')),
                            m('ol', {
                                    className: 'CountryList'
                                },
                                [this.countries.map(CountryItem)]
                            ),
                            m('div', {className: 'CountriesPage-loadMore'}, [loading])
                        ])
                    ])
                ])
            ])
        ];
    }

    refresh(clear = true) {
        if (clear) {
            this.loading = true;
            this.countries = [];
        }

        return this.loadResults().then(
            results => {
                this.countries = [];
                this.parseResults(results);
            },
            () => {
                this.loading = false;
                m.redraw();
            }
        );
    }

    loadResults(offset) {
        const params = {};
        params.page = {offset};

        return app.store.find('countries', params);
    }

    loadMore() {
        this.loading = true;

        this.loadResults(this.countries.length)
            .then(this.parseResults.bind(this));
    }

    parseResults(results) {
        [].push.apply(this.countries, results);

        this.loading = false;
        this.moreResults = !!results.payload.links.next;

        m.lazyRedraw();

        return results;
    }
}