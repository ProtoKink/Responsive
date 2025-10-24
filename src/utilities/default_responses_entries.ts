import { ResponsesSettingsModel } from "../models/responses";

const DefaultResponses = {
  pain: ["Aie!", "Aoouch!", "Aaaaie!", "Ouch", "Aow"],
  tickle: ["Hahaha!", "Mmmmhahaha!", "Muhahah...", "Ha!Ha!"],
  boop: ["Eek!", "Beep!", "Aww.."],

  low: ["", "", "mh", "♥oh♥", "ah", "...♥"],
  light: ["ah♥", "Aah!", "mh", "oh!♥", "mh♥"],
  medium: ["mm", "aaaah", "Mm.. Ah♥"],
  hot: ["nh... ah♥", "Oooh", "mmmmmh!", "HaaA♥"],
  orgasm: ["Mh...Mn...HaaAAaah!", "Mmmmh... MMmh... Hhhmmmm...", "Oooooh... Mmmmh... OooOOOOh!", "Mmmhnn... Nyhmm... aah!"]
};

const setData = (key: string) => {
  let oldSettings = null;
  //@ts-ignore
  if (Player?.OnlineSettings?.BCResponsive?.data) {
    oldSettings = JSON.parse(
      //@ts-ignore
      LZString.decompressFromBase64(Player?.OnlineSettings?.BCResponsive?.data)
    );
  }

  return oldSettings ? (oldSettings?.[key] ? oldSettings?.[key] : DefaultResponses[key as keyof typeof DefaultResponses]) : DefaultResponses[key as keyof typeof DefaultResponses];
};

export function getDefaultResponsesEntries() {
  return <ResponsesSettingsModel>{
    mainResponses: [
      {
        actName: "Pet",
        groupName: ["ItemNose"],
        responses: setData("boop"),
        selfTrigger: false
      },
      {
        actName: "LSCG_SharkBite",
        groupName: ["ItemNose"],
        responses: setData("boop"),
        selfTrigger: false
      },
      {
        actName: "Slap",
        groupName: ["ItemVulva", "ItemVulvaPiercings", "ItemBreast", "ItemHead"],
        responses: setData("pain"),
        selfTrigger: true
      },
      {
        actName: "Bite",
        groupName: [
          "ItemFeet",
          "ItemLegs",
          "ItemButt",
          "ItemTorso",
          "ItemTorso2",
          "ItemNipples",
          "ItemBreast",
          "ItemArms",
          "ItemHands",
          "ItemNeck",
          "ItemMouth",
          "ItemNose",
          "ItemEars",
          "ItemBoots"
        ],
        responses: setData("pain"),
        selfTrigger: true
      },
      {
        actName: "Spank",
        groupName: ["ItemFeet", "ItemLegs", "ItemButt", "ItemPelvis", "ItemTorso", "ItemTorso2", "ItemArms", "ItemHands", "ItemBoots"],
        responses: setData("pain"),
        selfTrigger: true
      },
      {
        actName: "Kick",
        groupName: ["ItemFeet", "ItemLegs", "ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemBoots"],
        responses: setData("pain")
      },
      {
        actName: "Pinch",
        groupName: ["ItemButt", "ItemPelvis", "ItemNipples", "ItemArms", "ItemMouth", "ItemNose", "ItemEars"],
        responses: setData("pain"),
        selfTrigger: true
      },
      {
        actName: "SpankItem",
        groupName: [
          "ItemFeet",
          "ItemLegs",
          "ItemVulva",
          "ItemVulvaPiercings",
          "ItemButt",
          "ItemPelvis",
          "ItemTorso",
          "ItemNipples",
          "ItemBreast",
          "ItemArms",
          "ItemBoots"
        ],
        responses: setData("pain"),
        selfTrigger: true
      },
      {
        actName: "ShockItem",
        groupName: [
          "ItemFeet",
          "ItemLegs",
          "ItemVulva",
          "ItemVulvaPiercings",
          "ItemButt",
          "ItemPelvis",
          "ItemTorso",
          "ItemNipples",
          "ItemBreast",
          "ItemArms",
          "ItemNeck",
          "ItemNeckAccessories",
          "ItemBoots"
        ],
        responses: setData("pain"),
        selfTrigger: true
      },
      {
        actName: "LSCG_SharkBite",
        groupName: [
          "ItemFeet",
          "ItemLegs",
          "ItemButt",
          "ItemTorso",
          "ItemNipples",
          "ItemBreast",
          "ItemArms",
          "ItemHands",
          "ItemNeck",
          "ItemEars",
          "ItemBoots"
        ],
        responses: setData("pain")
      },
      {
        actName: "Tickle",
        groupName: ["ItemFeet", "ItemLegs", "ItemPelvis", "ItemTorso", "ItemTorso2", "ItemBreast", "ItemArms", "ItemNeck", "ItemBoots"],
        responses: setData("tickle")
      },
      {
        actName: "TickleItem",
        groupName: [
          "ItemFeet",
          "ItemLegs",
          "ItemVulva",
          "ItemVulvaPiercings",
          "ItemButt",
          "ItemPelvis",
          "ItemTorso",
          "ItemNipples",
          "ItemBreast",
          "ItemArms",
          "ItemNeck",
          "ItemMouth",
          "ItemNose",
          "ItemHood",
          "ItemEars",
          "ItemBoots"
        ],
        responses: setData("tickle")
      }
    ],
    extraResponses: {
      low: setData("low"),
      light: setData("light"),
      medium: setData("medium"),
      hot: setData("hot"),
      orgasm: setData("orgasm")
    }
  };
}
