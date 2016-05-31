import Component from 'flarum/Component';
import avatar from 'flarum/helpers/avatar';
import icon from 'flarum/helpers/icon';
import listItems from 'flarum/helpers/listItems';
import ItemList from 'flarum/utils/ItemList';
import Button from 'flarum/components/Button';
import LoadingIndicator from 'flarum/components/LoadingIndicator';

export default class ImageEditor extends Component {
  init() {
    this.loading = false;
  }

  static initProps(props) {
    super.initProps(props);

    props.className = props.className || '';
  }

  view() {
    const entity = this.props.entity;

    return (
      <div className={'ImageEditor Dropdown ' + this.props.className + (this.loading ? ' loading' : '')}>
        {avatar(entity)}
        <a className="Dropdown-toggle"
          data-toggle="dropdown"
          onclick={this.quickUpload.bind(this)}>
          {this.loading ? LoadingIndicator.component() : icon('pencil')}
        </a>
        <ul className="Dropdown-menu Menu">
          {listItems(this.controlItems().toArray())}
        </ul>
      </div>
    );
  }
  
  controlItems() {
    const items = new ItemList();

    items.add('upload',
      Button.component({
        icon: 'upload',
        children: app.translator.trans('core.forum.user.avatar_upload_button'),
        onclick: this.upload.bind(this)
      })
    );

    items.add('remove',
      Button.component({
        icon: 'times',
        children: app.translator.trans('core.forum.user.avatar_remove_button'),
        onclick: this.remove.bind(this)
      })
    );

    return items;
  }
  
  quickUpload(e) {
    if (!this.props.entity.img()) {
      e.preventDefault();
      e.stopPropagation();
      this.upload();
    }
  }
  
  upload() {
    if (this.loading) return;

    const entity = this.props.entity;
    const $input = $('<input type="file">');

    $input.appendTo('body').hide().click().on('change', e => {
      const data = new FormData();
      data.append('avatar', $(e.target)[0].files[0]);

      this.loading = true;
      m.redraw();

      app.request({
        method: 'POST',
        url: app.forum.attribute('apiUrl') + '/users/' + user.id() + '/avatar',
        serialize: raw => raw,
        data
      }).then(
        this.success.bind(this),
        this.failure.bind(this)
      );
    });
  }
  
  remove() {
    const user = this.props.user;

    this.loading = true;
    m.redraw();

    app.request({
      method: 'DELETE',
      url: app.forum.attribute('apiUrl') + '/users/' + user.id() + '/avatar'
    }).then(
      this.success.bind(this),
      this.failure.bind(this)
    );
  }
  
  success(response) {
    app.store.pushPayload(response);
    delete this.props.user.avatarColor;

    this.loading = false;
    m.redraw();
  }
  
  failure() {
    this.loading = false;
    m.redraw();
  }
}
