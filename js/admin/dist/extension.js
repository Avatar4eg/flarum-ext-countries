'use strict';

System.register('avatar4eg/countries/addCountriesPane', ['flarum/extend', 'flarum/components/AdminNav', 'flarum/components/AdminLinkButton', 'avatar4eg/countries/components/CountriesPage'], function (_export, _context) {
  var extend, AdminNav, AdminLinkButton, CountriesPage;

  _export('default', function () {
    app.routes.countries = { path: '/countries', component: CountriesPage.component() };

    app.extensionSettings['avatar4eg-countries'] = function () {
      return m.route(app.route('countries'));
    };

    extend(AdminNav.prototype, 'items', function (items) {
      items.add('countries', AdminLinkButton.component({
        href: app.route('countries'),
        icon: 'globe',
        children: app.translator.trans('avatar4eg-countries.admin.nav.countries_button'),
        description: app.translator.trans('avatar4eg-countries.admin.nav.countries_text')
      }));
    });
  });

  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumComponentsAdminNav) {
      AdminNav = _flarumComponentsAdminNav.default;
    }, function (_flarumComponentsAdminLinkButton) {
      AdminLinkButton = _flarumComponentsAdminLinkButton.default;
    }, function (_avatar4egCountriesComponentsCountriesPage) {
      CountriesPage = _avatar4egCountriesComponentsCountriesPage.default;
    }],
    execute: function () {}
  };
});;
'use strict';

System.register('avatar4eg/countries/components/CountriesPage', ['flarum/components/Page', 'flarum/components/Button', 'flarum/components/LoadingIndicator', 'avatar4eg/countries/components/EditCountryModal'], function (_export, _context) {
    var Page, Button, LoadingIndicator, EditCountryModal, CountriesPage;


    function CountryItem(country) {
        return [m('li', { "data-id": country.id() }, [m('div', { className: 'CountryListItem-info' }, [m('span', { className: 'CountryListItem-name' }, [country.id(), '. ', country.title()]), Button.component({
            className: 'Button Button--link',
            icon: 'pencil',
            onclick: function onclick() {
                return app.modal.show(new EditCountryModal({ country: country }));
            }
        })])])];
    }

    return {
        setters: [function (_flarumComponentsPage) {
            Page = _flarumComponentsPage.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_flarumComponentsLoadingIndicator) {
            LoadingIndicator = _flarumComponentsLoadingIndicator.default;
        }, function (_avatar4egCountriesComponentsEditCountryModal) {
            EditCountryModal = _avatar4egCountriesComponentsEditCountryModal.default;
        }],
        execute: function () {
            CountriesPage = function (_Page) {
                babelHelpers.inherits(CountriesPage, _Page);

                function CountriesPage() {
                    babelHelpers.classCallCheck(this, CountriesPage);
                    return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(CountriesPage).apply(this, arguments));
                }

                babelHelpers.createClass(CountriesPage, [{
                    key: 'init',
                    value: function init() {
                        babelHelpers.get(Object.getPrototypeOf(CountriesPage.prototype), 'init', this).call(this);

                        this.loading = true;
                        this.moreResults = false;
                        this.countries = [];
                        this.refresh();
                    }
                }, {
                    key: 'view',
                    value: function view() {
                        var loading = void 0;

                        if (this.loading) {
                            loading = LoadingIndicator.component();
                        } else if (this.moreResults) {
                            loading = Button.component({
                                children: app.translator.trans('avatar4eg-countries.admin.countries.load_more_button'),
                                className: 'Button',
                                onclick: this.loadMore.bind(this)
                            });
                        }

                        return [m('div', { className: 'CountriesPage' }, [m('div', { className: 'CountriesPage-header' }, [m('div', { className: 'container' }, [m('p', {}, app.translator.trans('avatar4eg-countries.admin.countries.about_text')), Button.component({
                            className: 'Button Button--primary',
                            icon: 'plus',
                            children: app.translator.trans('avatar4eg-countries.admin.countries.create_button'),
                            onclick: function onclick() {
                                return app.modal.show(new EditCountryModal());
                            }
                        })])]), m('div', { className: 'CountriesPage-list' }, [m('div', { className: 'container' }, [m('div', { className: 'CountryItems' }, [m('label', {}, app.translator.trans('avatar4eg-countries.admin.countries.countries')), m('ol', {
                            className: 'CountryList'
                        }, [this.countries.map(CountryItem)]), m('div', { className: 'CountriesPage-loadMore' }, [loading])])])])])];
                    }
                }, {
                    key: 'refresh',
                    value: function refresh() {
                        var _this2 = this;

                        var clear = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

                        if (clear) {
                            this.loading = true;
                            this.countries = [];
                        }

                        return this.loadResults().then(function (results) {
                            _this2.countries = [];
                            _this2.parseResults(results);
                        }, function () {
                            _this2.loading = false;
                            m.redraw();
                        });
                    }
                }, {
                    key: 'loadResults',
                    value: function loadResults(offset) {
                        var params = {};
                        params.page = { offset: offset };

                        return app.store.find('countries', params);
                    }
                }, {
                    key: 'loadMore',
                    value: function loadMore() {
                        this.loading = true;

                        this.loadResults(this.countries.length).then(this.parseResults.bind(this));
                    }
                }, {
                    key: 'parseResults',
                    value: function parseResults(results) {
                        [].push.apply(this.countries, results);

                        this.loading = false;
                        this.moreResults = !!results.payload.links.next;

                        m.lazyRedraw();

                        return results;
                    }
                }]);
                return CountriesPage;
            }(Page);

            _export('default', CountriesPage);
        }
    };
});;
'use strict';

System.register('avatar4eg/countries/components/EditCountryModal', ['flarum/components/Modal', 'flarum/components/Button', 'flarum/utils/string', 'flarum/components/Select'], function (_export, _context) {
    var Modal, Button, slug, Select, EditCountryModal;
    return {
        setters: [function (_flarumComponentsModal) {
            Modal = _flarumComponentsModal.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_flarumUtilsString) {
            slug = _flarumUtilsString.slug;
        }, function (_flarumComponentsSelect) {
            Select = _flarumComponentsSelect.default;
        }],
        execute: function () {
            EditCountryModal = function (_Modal) {
                babelHelpers.inherits(EditCountryModal, _Modal);

                function EditCountryModal() {
                    babelHelpers.classCallCheck(this, EditCountryModal);
                    return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(EditCountryModal).apply(this, arguments));
                }

                babelHelpers.createClass(EditCountryModal, [{
                    key: 'init',
                    value: function init() {
                        babelHelpers.get(Object.getPrototypeOf(EditCountryModal.prototype), 'init', this).call(this);

                        this.country = this.props.country || app.store.createRecord('countries');

                        this.itemTitle = m.prop(this.country.title() || '');
                        this.iso = m.prop(this.country.iso() || '');
                        this.img = m.prop(this.country.img() || '');
                        this.description = m.prop(this.country.description() || '');
                        this.tag = m.prop(this.country.tag() ? this.country.tag().id() : 0);
                        this.personalTag = m.prop(this.country.personalTag() ? this.country.personalTag().id() : 0);

                        this.tags = [];
                        this.tags[0] = app.translator.trans('avatar4eg-countries.admin.edit_country.select_not_set');
                        var parent = this;
                        app.store.all('tags').filter(function (tag) {
                            return !tag.isChild();
                        }).map(function (tag) {
                            parent.tags[tag.id()] = tag.name();
                        });

                        this.subtags = app.store.all('tags').filter(function (tag) {
                            return tag.isChild();
                        });
                    }
                }, {
                    key: 'className',
                    value: function className() {
                        return 'EditCountryModal Modal--large';
                    }
                }, {
                    key: 'title',
                    value: function title() {
                        var title = this.itemTitle();
                        return title ? title : app.translator.trans('avatar4eg-countries.admin.edit_country.title');
                    }
                }, {
                    key: 'content',
                    value: function content() {
                        var parent = this;
                        var subtags = [];
                        subtags[0] = app.translator.trans('avatar4eg-countries.admin.edit_country.select_not_set');

                        if (this.tag() !== 0 && this.subtags instanceof Array) {
                            for (var index in this.subtags) {
                                if (Object.prototype.hasOwnProperty.call(this.subtags, index)) {
                                    var tag = this.subtags[index];
                                    if (tag.parent() && tag.parent().id() === this.tag()) subtags[tag.id()] = tag.name();
                                }
                            }
                        }

                        return [m('div', { className: 'Modal-body' }, [m('form', {
                            className: 'Form',
                            onsubmit: this.onsubmit.bind(this)
                        }, [m('div', { className: 'Form-group' }, [m('label', {}, app.translator.trans('avatar4eg-countries.admin.edit_country.iso_label')), m('input', {
                            className: 'FormControl',
                            placeholder: app.translator.trans('avatar4eg-countries.admin.edit_country.iso_placeholder'),
                            value: this.iso(),
                            oninput: m.withAttr('value', this.iso)
                        })]), m('div', { className: 'Form-group' }, [m('label', {}, app.translator.trans('avatar4eg-countries.admin.edit_country.title_label')), m('input', {
                            className: 'FormControl',
                            placeholder: app.translator.trans('avatar4eg-countries.admin.edit_country.title_placeholder'),
                            value: this.itemTitle(),
                            oninput: m.withAttr('value', this.itemTitle)
                        })]), m('div', { className: 'Form-group' }, [m('label', {}, app.translator.trans('avatar4eg-countries.admin.edit_country.img_label')), m('a', {
                            onclick: this.upload.bind(this)
                        }, [m('img', {
                            class: 'ImageHolder',
                            src: this.img(),
                            style: 'width: 100%;'
                        })])]), m('div', { className: 'Form-group' }, [m('label', {}, app.translator.trans('avatar4eg-countries.admin.edit_country.description_label')), m('textarea', {
                            className: 'FormControl',
                            rows: 10,
                            style: "resize: vertical;",
                            placeholder: app.translator.trans('avatar4eg-countries.admin.edit_country.description_placeholder'),
                            value: this.description(),
                            oninput: m.withAttr('value', this.description)
                        })]), m('div', { className: 'Form-group' }, [m('label', {}, app.translator.trans('avatar4eg-countries.admin.edit_country.tag_label')), Select.component({
                            className: 'FormControl',
                            options: this.tags,
                            onchange: function onchange(value) {
                                parent.tag(value);
                                parent.personalTag(0);
                            },
                            value: this.tag()
                        })]), m('div', { className: 'Form-group' }, [m('label', {}, app.translator.trans('avatar4eg-countries.admin.edit_country.subtag_label')), Select.component({
                            className: 'FormControl',
                            options: subtags,
                            onchange: this.personalTag,
                            value: this.personalTag()
                        })]), m('div', { className: 'Form-group' }, [Button.component({
                            type: 'submit',
                            className: 'Button Button--primary EditContactModal-save',
                            loading: this.loading,
                            children: app.translator.trans('avatar4eg-countries.admin.edit_country.submit_button')
                        }), this.country.exists ? Button.component({
                            type: 'button',
                            className: 'Button EditContactModal-delete',
                            onclick: this.deleteItem.bind(this),
                            children: app.translator.trans('avatar4eg-countries.admin.edit_country.delete_country_button')
                        }) : ''])])])];
                    }
                }, {
                    key: 'upload',
                    value: function upload() {
                        var parent = this;
                        var $input = $('<input type="file">');

                        $input.appendTo('body').hide().click().on('change', function (e) {
                            if ($(e.target)[0].files && $(e.target)[0].files[0] && typeof FileReader != "undefined") {
                                var reader = new FileReader();
                                reader.onload = function (e) {
                                    parent.img(e.target.result);
                                    $('.ImageHolder').attr('src', e.target.result);
                                };
                                reader.readAsDataURL($(e.target)[0].files[0]);
                            }

                            m.redraw();
                        });
                    }
                }, {
                    key: 'onsubmit',
                    value: function onsubmit(e) {
                        var _this2 = this;

                        e.preventDefault();

                        this.loading = true;

                        var tag = {};
                        if (this.tag() !== 0) {
                            tag.id = this.tag();
                            tag.object = app.store.getById('tags', this.tag());
                        } else {
                            tag.id = null;
                            tag.object = null;
                        }
                        var personalTag = {};
                        if (this.personalTag() !== 0) {
                            personalTag.id = this.personalTag();
                            personalTag.object = app.store.getById('tags', this.personalTag());
                        } else {
                            personalTag.id = null;
                            personalTag.object = null;
                        }

                        var data = {
                            iso: this.iso(),
                            title: this.itemTitle(),
                            img: this.img() !== '' ? this.img() : null,
                            description: this.description(),
                            tag_id: tag.id,
                            personal_tag_id: personalTag.id,
                            relationships: {}
                        };

                        var relationships_data = {
                            relationships: {
                                tag: tag.object,
                                personalTag: personalTag.object
                            }
                        };

                        this.country.save(data).then(function () {
                            _this2.country.pushData(relationships_data);
                            _this2.hide();
                        }, function (response) {
                            _this2.loading = false;
                            _this2.handleErrors(response);
                        });
                    }
                }, {
                    key: 'deleteItem',
                    value: function deleteItem() {
                        if (confirm(app.translator.trans('avatar4eg-countries.admin.edit_country.delete_country_confirmation'))) {
                            this.country.delete({}).then(function () {
                                return m.redraw();
                            });
                            this.hide();
                        }
                    }
                }]);
                return EditCountryModal;
            }(Modal);

            _export('default', EditCountryModal);
        }
    };
});;
'use strict';

System.register('avatar4eg/countries/components/ImageEditor', ['flarum/Component', 'flarum/helpers/avatar', 'flarum/helpers/icon', 'flarum/helpers/listItems', 'flarum/utils/ItemList', 'flarum/components/Button', 'flarum/components/LoadingIndicator'], function (_export, _context) {
  var Component, avatar, icon, listItems, ItemList, Button, LoadingIndicator, ImageEditor;
  return {
    setters: [function (_flarumComponent) {
      Component = _flarumComponent.default;
    }, function (_flarumHelpersAvatar) {
      avatar = _flarumHelpersAvatar.default;
    }, function (_flarumHelpersIcon) {
      icon = _flarumHelpersIcon.default;
    }, function (_flarumHelpersListItems) {
      listItems = _flarumHelpersListItems.default;
    }, function (_flarumUtilsItemList) {
      ItemList = _flarumUtilsItemList.default;
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton.default;
    }, function (_flarumComponentsLoadingIndicator) {
      LoadingIndicator = _flarumComponentsLoadingIndicator.default;
    }],
    execute: function () {
      ImageEditor = function (_Component) {
        babelHelpers.inherits(ImageEditor, _Component);

        function ImageEditor() {
          babelHelpers.classCallCheck(this, ImageEditor);
          return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(ImageEditor).apply(this, arguments));
        }

        babelHelpers.createClass(ImageEditor, [{
          key: 'init',
          value: function init() {
            this.loading = false;
          }
        }, {
          key: 'view',
          value: function view() {
            var entity = this.props.entity;

            return m(
              'div',
              { className: 'ImageEditor Dropdown ' + this.props.className + (this.loading ? ' loading' : '') },
              avatar(entity),
              m(
                'a',
                { className: 'Dropdown-toggle',
                  'data-toggle': 'dropdown',
                  onclick: this.quickUpload.bind(this) },
                this.loading ? LoadingIndicator.component() : icon('pencil')
              ),
              m(
                'ul',
                { className: 'Dropdown-menu Menu' },
                listItems(this.controlItems().toArray())
              )
            );
          }
        }, {
          key: 'controlItems',
          value: function controlItems() {
            var items = new ItemList();

            items.add('upload', Button.component({
              icon: 'upload',
              children: app.translator.trans('core.forum.user.avatar_upload_button'),
              onclick: this.upload.bind(this)
            }));

            items.add('remove', Button.component({
              icon: 'times',
              children: app.translator.trans('core.forum.user.avatar_remove_button'),
              onclick: this.remove.bind(this)
            }));

            return items;
          }
        }, {
          key: 'quickUpload',
          value: function quickUpload(e) {
            if (!this.props.entity.img()) {
              e.preventDefault();
              e.stopPropagation();
              this.upload();
            }
          }
        }, {
          key: 'upload',
          value: function upload() {
            var _this2 = this;

            if (this.loading) return;

            var entity = this.props.entity;
            var $input = $('<input type="file">');

            $input.appendTo('body').hide().click().on('change', function (e) {
              var data = new FormData();
              data.append('avatar', $(e.target)[0].files[0]);

              _this2.loading = true;
              m.redraw();

              app.request({
                method: 'POST',
                url: app.forum.attribute('apiUrl') + '/users/' + user.id() + '/avatar',
                serialize: function serialize(raw) {
                  return raw;
                },
                data: data
              }).then(_this2.success.bind(_this2), _this2.failure.bind(_this2));
            });
          }
        }, {
          key: 'remove',
          value: function remove() {
            var user = this.props.user;

            this.loading = true;
            m.redraw();

            app.request({
              method: 'DELETE',
              url: app.forum.attribute('apiUrl') + '/users/' + user.id() + '/avatar'
            }).then(this.success.bind(this), this.failure.bind(this));
          }
        }, {
          key: 'success',
          value: function success(response) {
            app.store.pushPayload(response);
            delete this.props.user.avatarColor;

            this.loading = false;
            m.redraw();
          }
        }, {
          key: 'failure',
          value: function failure() {
            this.loading = false;
            m.redraw();
          }
        }], [{
          key: 'initProps',
          value: function initProps(props) {
            babelHelpers.get(Object.getPrototypeOf(ImageEditor), 'initProps', this).call(this, props);

            props.className = props.className || '';
          }
        }]);
        return ImageEditor;
      }(Component);

      _export('default', ImageEditor);
    }
  };
});;
'use strict';

System.register('avatar4eg/countries/main', ['avatar4eg/countries/models/Country', 'avatar4eg/countries/addCountriesPane'], function (_export, _context) {
    var Country, addCountriesPane;
    return {
        setters: [function (_avatar4egCountriesModelsCountry) {
            Country = _avatar4egCountriesModelsCountry.default;
        }, function (_avatar4egCountriesAddCountriesPane) {
            addCountriesPane = _avatar4egCountriesAddCountriesPane.default;
        }],
        execute: function () {

            app.initializers.add('avatar4eg-countries', function (app) {
                app.store.models.countries = Country;
                addCountriesPane();
            });
        }
    };
});;
'use strict';

System.register('avatar4eg/countries/models/Country', ['flarum/Model', 'flarum/utils/mixin'], function (_export, _context) {
    var Model, mixin, Country;
    return {
        setters: [function (_flarumModel) {
            Model = _flarumModel.default;
        }, function (_flarumUtilsMixin) {
            mixin = _flarumUtilsMixin.default;
        }],
        execute: function () {
            Country = function (_mixin) {
                babelHelpers.inherits(Country, _mixin);

                function Country() {
                    babelHelpers.classCallCheck(this, Country);
                    return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(Country).apply(this, arguments));
                }

                return Country;
            }(mixin(Model, {
                iso: Model.attribute('iso'),
                title: Model.attribute('title'),
                img: Model.attribute('img'),
                description: Model.attribute('description'),
                tag: Model.hasOne('tag'),
                personalTag: Model.hasOne('personalTag'),
                related: Model.hasMany('related')
            }));

            _export('default', Country);
        }
    };
});