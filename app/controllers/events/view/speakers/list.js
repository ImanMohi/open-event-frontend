import Controller from '@ember/controller';
import { action } from '@ember/object';
import EmberTableControllerMixin from 'open-event-frontend/mixins/ember-table-controller';


export default class extends Controller.extend(EmberTableControllerMixin) {
  get columns() {
    return [
      {
        name            : ' ',
        valuePath       : 'thumbnailImageUrl',
        extraValuePaths : ['photoUrl'],
        cellComponent   : 'ui-table/cell/events/view/speakers/speaker-logo'
      },
      {
        name            : this.l10n.t('Name'),
        valuePath       : 'name',
        extraValuePaths : ['id', 'event'],
        isSortable      : true,
        headerComponent : 'tables/headers/sort',
        cellComponent   : 'ui-table/cell/events/view/speakers/cell-buttons',
        width           : 150,
        actions         : {
          deleteSpeaker : this.deleteSpeaker.bind(this),
          editSpeaker   : this.editSpeaker.bind(this),
          viewSpeaker   : this.viewSpeaker.bind(this)
        }
      },
      {
        name            : this.l10n.t('Position'),
        valuePath       : 'position',
        isSortable      : true,
        headerComponent : 'tables/headers/sort',
        width           : 150
      },
      {
        name            : this.l10n.t('Organization'),
        valuePath       : 'organisation',
        isSortable      : true,
        headerComponent : 'tables/headers/sort',
        width           : 150
      },
      {
        name            : this.l10n.t('Email'),
        valuePath       : 'email',
        isSortable      : true,
        headerComponent : 'tables/headers/sort',
        width           : 150
      },
      {
        name          : this.l10n.t('Phone'),
        valuePath     : 'mobile',
        cellComponent : 'ui-table/cell/events/view/speakers/speaker-mobile'
      },
      {
        name          : this.l10n.t('Submitted Sessions'),
        valuePath     : 'sessions',
        cellComponent : 'ui-table/cell/events/view/speakers/cell-simple-sessions',
        width         : 250
      },
      {
        name            : this.l10n.t('Feature'),
        valuePath       : 'id',
        extraValuePaths : ['isFeatured'],
        cellComponent   : 'ui-table/cell/events/view/speakers/cell-is-featured',
        actions         : {
          toggleFeatured: this.toggleFeatured.bind(this)
        }
      }
    ];
  }

  @action
  async deleteSpeaker(speaker_id) {
    this.set('isLoading', true);
    const speaker =  this.store.peekRecord('speaker', speaker_id, { backgroundReload: true });
    try {
      await speaker.destroyRecord();
      this.notify.success(this.l10n.t('Speaker has been deleted successfully.'));
      this.refreshModel();
    } catch (e) {
      console.error('Error while deleting speaker', e);
      this.notify.error(this.l10n.t('An unexpected error has occurred.'));
    }
    this.set('isLoading', false);
  }

  @action
  editSpeaker(id) {
    this.transitionToRoute('events.view.speakers.edit', id);
  }

  @action
  viewSpeaker(speaker) {
    this.transitionToRoute('public.speaker.view', speaker.event.get('identifier'), speaker.id);
  }

  @action
  async toggleFeatured(speaker_id) {
    const speaker =  this.store.peekRecord('speaker', speaker_id, { backgroundReload: false });
    speaker.toggleProperty('isFeatured');
    try {
      await speaker.save();
      this.notify.success(this.l10n.t('Speaker details modified successfully'));
    } catch (e) {
      console.error('Error while updating speaker', e);
      this.notify.error(this.l10n.t('An unexpected error has occurred.'));
    }
  }
}
