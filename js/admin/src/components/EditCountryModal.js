import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';
import { slug } from 'flarum/utils/string';
import Select from 'flarum/components/Select';

/**
 * The `EditCountryModal` component shows a modal dialog which allows the user
 * to create or edit a country.
 */
export default class EditCountryModal extends Modal {
    init() {
        super.init();

        this.country = this.props.country || app.store.createRecord('countries');

        this.itemTitle = m.prop(this.country.title() || '');
        this.iso = m.prop(this.country.iso() || '');
        this.img = m.prop(this.country.img() || '');
        this.description = m.prop(this.country.description() || '');
        this.tag = m.prop(this.country.tag() ? this.country.tag().id() : 0);
        this.personalTag = m.prop(this.country.personalTag() ? this.country.personalTag().id() : 0);

        this.tags = [];
        this.tags[0] = app.translator.trans('avatar4eg-countries.admin.edit_country.select_not_set');
        let parent = this;
        app.store.all('tags')
            .filter(tag => !tag.isChild())
            .map(function (tag) {
                parent.tags[tag.id()] = tag.name();
            });

        this.subtags = app.store.all('tags')
            .filter(tag => tag.isChild());
    }

    className() {
        return 'EditCountryModal Modal--large';
    }

    title() {
        const title = this.itemTitle();
        return title
            ? title
            : app.translator.trans('avatar4eg-countries.admin.edit_country.title');
    }

    content() {
        let parent = this;
        let subtags = [];
        subtags[0] = app.translator.trans('avatar4eg-countries.admin.edit_country.select_not_set');

        if(this.tag() !== 0 && this.subtags instanceof Array) {
            for(var index in this.subtags) {
                if(Object.prototype.hasOwnProperty.call(this.subtags, index)) {
                    let tag = this.subtags[index];
                    if (tag.parent() && tag.parent().id() === this.tag()) subtags[tag.id()] = tag.name();
                }
            }
        }

        return [
            m('div', {className: 'Modal-body'}, [
                m('form', {
                        className: 'Form',
                        onsubmit: this.onsubmit.bind(this)
                    },
                    [
                        m('div', {className: 'Form-group'}, [
                            m('label', {}, app.translator.trans('avatar4eg-countries.admin.edit_country.iso_label')),
                            m('input', {
                                className: 'FormControl',
                                placeholder: app.translator.trans('avatar4eg-countries.admin.edit_country.iso_placeholder'),
                                value: this.iso(),
                                oninput: m.withAttr('value', this.iso)
                            })
                        ]),
                        m('div', {className: 'Form-group'}, [
                            m('label', {}, app.translator.trans('avatar4eg-countries.admin.edit_country.title_label')),
                            m('input', {
                                className: 'FormControl',
                                placeholder: app.translator.trans('avatar4eg-countries.admin.edit_country.title_placeholder'),
                                value: this.itemTitle(),
                                oninput: m.withAttr('value', this.itemTitle)
                            })
                        ]),
                        m('div', {className: 'Form-group'}, [
                            m('label', {}, app.translator.trans('avatar4eg-countries.admin.edit_country.img_label')),
                            m('a', {
                                onclick: this.upload.bind(this)
                            }, [
                                m('img', {
                                    class: 'ImageHolder',
                                    src: this.img(),
                                    style: 'width: 100%;'
                                })
                            ])
                        ]),
                        m('div', {className: 'Form-group'}, [
                            m('label', {}, app.translator.trans('avatar4eg-countries.admin.edit_country.description_label')),
                            m('textarea', {
                                className: 'FormControl',
                                rows: 10,
                                style: "resize: vertical;",
                                placeholder: app.translator.trans('avatar4eg-countries.admin.edit_country.description_placeholder'),
                                value: this.description(),
                                oninput: m.withAttr('value', this.description)
                            })
                        ]),
                        m('div', {className: 'Form-group'}, [
                            m('label', {}, app.translator.trans('avatar4eg-countries.admin.edit_country.tag_label')),
                            Select.component({
                                className: 'FormControl',
                                options: this.tags,
                                onchange: function (value) {
                                    parent.tag(value);
                                    parent.personalTag(0);
                                },
                                value: this.tag()
                            })
                        ]),
                        m('div', {className: 'Form-group'}, [
                            m('label', {}, app.translator.trans('avatar4eg-countries.admin.edit_country.subtag_label')),
                            Select.component({
                                className: 'FormControl',
                                options: subtags,
                                onchange: this.personalTag,
                                value: this.personalTag()
                            })
                        ]),
                        m('div', {className: 'Form-group'}, [
                            Button.component({
                                type: 'submit',
                                className: 'Button Button--primary EditContactModal-save',
                                loading: this.loading,
                                children: app.translator.trans('avatar4eg-countries.admin.edit_country.submit_button')
                            }),
                            this.country.exists ? (
                                Button.component({
                                    type: 'button',
                                    className: 'Button EditContactModal-delete',
                                    onclick: this.deleteItem.bind(this),
                                    children: app.translator.trans('avatar4eg-countries.admin.edit_country.delete_country_button')
                                })
                            ) : ''
                        ])
                    ]
                )
            ])
        ];
    }

    upload() {
        let parent = this;
        const $input = $('<input type="file">');

        $input.appendTo('body').hide().click().on('change', e => {
            if ($(e.target)[0].files && $(e.target)[0].files[0] && typeof (FileReader) != "undefined") {
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

    onsubmit(e) {
        e.preventDefault();

        this.loading = true;

        let tag = {};
        if (this.tag() !== 0) {
            tag.id = this.tag();
            tag.object = app.store.getById('tags', this.tag());
        } else {
            tag.id = null;
            tag.object = null;
        }
        let personalTag = {};
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

        this.country.save(data).then(
            () => {
                this.country.pushData(relationships_data);
                this.hide();
            },
            response => {
                this.loading = false;
                this.handleErrors(response);
            }
        );
    }

    deleteItem() {
        if (confirm(app.translator.trans('avatar4eg-countries.admin.edit_country.delete_country_confirmation'))) {
            this.country.delete({}).then(() => m.redraw());
            this.hide();
        }
    }
}
