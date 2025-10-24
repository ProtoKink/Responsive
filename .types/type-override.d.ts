interface PlayerCharacter extends Character {
  Responsive: import("../src/models/settings").SettingsModel;
}

interface OtherCharacter extends Character {
  Responsive: import("../src/models/settings").SettingsModel;
}

interface PlayerOnlineSettings {
  Responsive: import("../src/models/settings").SettingsModel;
}

interface ExtensionSettings {
  Responsive: string;
}
