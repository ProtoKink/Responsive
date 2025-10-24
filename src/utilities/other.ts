export function getCharacter(memberNumber?: number) {
  return ChatRoomCharacter.find((c) => c.MemberNumber == memberNumber) ?? undefined;
}

export function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export function injectStyle(styleSrc: string, styleId: string) {
  const checkStyle = !!document.getElementById(styleId);
  if (checkStyle) return;

  const styleElement = document.createElement("style");
  styleElement.id = styleId;
  styleElement.appendChild(document.createTextNode(styleSrc));
  document.head.appendChild(styleElement);
}
