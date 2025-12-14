import { advElement, BaseSubscreen, getText, layout, Modal, SubscreenOptions } from 'bc-deeplib/deeplib';
import { ProfileEntryModel, ProfilesSettingsModel } from '../models/profiles';
import { logger } from '../utilities/definition';
import { BehaviorsSettingsModel } from '../models/behaviors';
import { GlobalSettingsModel } from '../models/base';
import { modStorage } from '../utilities/data';


export class GuiProfiles extends BaseSubscreen {

  protected static override subscreenOptions: SubscreenOptions = {
    name: 'profiles',
    icon: `${PUBLIC_URL}/images/users_group.svg`,
    drawCharacter: false
  };

  get settings(): ProfilesSettingsModel {
    return super.settings as ProfilesSettingsModel;
  }

  load() {
    super.load();

    const profilesContainer = ElementCreate({
      tag: 'div',
      classList: ['rsp-profiles-container'],
      attributes: {
        id: 'rsp-profiles-container'
      },
      parent: layout.getSubscreen()
    });

    for (let i = 0; i < 3; i++) {
      const profileId = i + 1;
      const profileName = this.settings[profileId].name || getText('profiles.text.profile') + ` ${profileId}`;

      const profileElement = ElementCreate({
        tag: 'div',
        attributes: {
          id: `rsp-profile-${profileId}`,
        },
        classList: ['rsp-profile'],
        children: [
          advElement.createLabel({
            id: `rsp-profile-label-${profileId}`,
            label: profileName
          }),
          {
            tag: 'div',
            classList: ['rsp-profile-buttons'],
            children: [
              advElement.createButton({
                id: `rsp-profiles-profile-save-${profileId}`,
                onClick: () => this.handleProfilesSaving(profileId),
                options: {
                  label: getText('profiles.button.save'),
                }
              }),

              advElement.createButton({
                id: `rsp-profiles-profile-load-${profileId}`,
                onClick: () => this.handleProfilesLoading(profileId),
                options: {
                  label: getText('profiles.button.load'),
                  disabled: !this.profileExists(profileId)
                }
              }),

              advElement.createButton({
                id: `rsp-profiles-profile-delete-${profileId}`,
                onClick: () => this.handleProfilesDeleting(profileId),
                options: {
                  label: getText('profiles.button.delete'),
                  disabled: !this.profileExists(profileId)
                }
              }),
            ]
          }
        ]
      });

      profilesContainer.appendChild(profileElement);
    }

    CharacterAppearanceForceUpCharacter = Player.MemberNumber ?? -1;
  }

  resize(onLoad?: boolean): void {
    super.resize(onLoad);
  }

  private async handleProfilesSaving(profileId: number): Promise<void> {
    if (!this.profileCanBeSaved(profileId)) return;

    const name = await Modal.prompt(getText('profiles.prompt'));
    if (name === null) return;

    const storage = modStorage.playerStorage;
    const profile = this.settings[profileId];

    if (!profile || Object.keys(profile).length === 0) {
      this.settings[profileId] = {} as ProfileEntryModel;
    }

    this.settings[profileId] = CommonCloneDeep({
      name: name,
      data: {
        GlobalModule: storage.GlobalModule as GlobalSettingsModel,
        BehaviorsModule: storage.BehaviorsModule as BehaviorsSettingsModel
      },
    });

    const display = name ? `"${name}"` : profileId;
    ToastManager.success(`${getText('profiles.text.profile')} ${display} ${getText('profiles.text.has_been_saved')}`);

    this.updateProfileLabel(profileId);
    this.updateProfileButtons(profileId);
  }

  private handleProfilesLoading(profileId: number): void {
    if (!this.profileExists(profileId)) {
      ToastManager.error(`${getText('profiles.text.profile')} ${profileId} ${getText('profiles.text.doesnt_exist')}`);
      return;
    }

    const data = this.settings[profileId].data;

    modStorage.playerStorage = CommonCloneDeep({
      ...modStorage.playerStorage,
      GlobalModule: data.GlobalModule,
      BehaviorsModule: data.BehaviorsModule
    });

    const name = this.settings[profileId].name;
    const display = name ? `"${name}"` : profileId;
    ToastManager.success(`${getText('profiles.text.profile')} ${display} ${getText('profiles.text.has_been_loaded')}`);

  }

  private handleProfilesDeleting(profileId: number): void {
    if (!this.profileExists(profileId)) {
      ToastManager.info(`${getText('profiles.text.profile')} ${profileId} ${getText('profiles.text.doesnt_exist')}`);
      return;
    }

    const name = this.settings[profileId].name;

    this.settings[profileId] = {
      name: '',
      data: {}
    } as ProfileEntryModel;

    const display = name ? `"${name}"` : profileId;
    ToastManager.success(`${getText('profiles.text.profile')} ${display} ${getText('profiles.text.has_been_deleted')}`);

    this.updateProfileLabel(profileId);
    this.updateProfileButtons(profileId);
  }

  private updateProfileButtons(profileId: number): void {
    const profileSaveButton = ElementWrap(`rsp-profiles-profile-save-${profileId}`) as HTMLButtonElement;
    const profileLoadButton = ElementWrap(`rsp-profiles-profile-load-${profileId}`) as HTMLButtonElement;
    const profileDeleteButton = ElementWrap(`rsp-profiles-profile-delete-${profileId}`) as HTMLButtonElement;

    if (!profileSaveButton || !profileLoadButton || !profileDeleteButton) return;

    profileSaveButton.disabled = !this.profileCanBeSaved(profileId);
    profileLoadButton.disabled = !this.profileExists(profileId);
    profileDeleteButton.disabled = !this.profileExists(profileId);
  }

  private updateProfileLabel(profileId: number): void {
    const name = this.settings[profileId].name;
    const display = name ? name : `${getText('profiles.text.profile')} ${profileId}`;
    const profileLabel = ElementWrap(`rsp-profile-label-${profileId}`);
    if (!profileLabel) return;
    profileLabel.textContent = display;
  }

  private isValidProfileId(id: number): boolean {
    if (id < 1 || id > 3) {
      logger.warn(`Invalid profile id ${id}`);
      return false;
    }

    return true;
  }

  private profileCanBeSaved(profileId: number): boolean {
    if (!this.isValidProfileId(profileId)) return false;

    return true;
  }

  private profileExists(profileId: number): boolean {
    if (!this.isValidProfileId(profileId)) return false;

    const data = this.settings[profileId]?.data || {};

    if (!data || Object.keys(data).length === 0) return false;

    return true;
  }
}
