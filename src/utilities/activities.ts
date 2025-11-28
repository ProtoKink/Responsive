export function activityHasDictionaryText(KeyWord: string | undefined): boolean {
  if (!KeyWord) return false;

  if (!ActivityDictionary) ActivityDictionaryLoad();
  if (!ActivityDictionary) return false;

  for (let D = 0; D < ActivityDictionary.length; D++) if (ActivityDictionary[D][0] === KeyWord) return true;
  return false;
}

export function getActivityLabelTag(activityName: ActivityName | undefined, groupName: $AssetGroupItemName | undefined): `Label-ChatOther-${string}-${string}` | undefined {
  if (!activityName || !groupName) return undefined;

  if (Player.HasPenis()) {
    if (groupName === 'ItemVulva') groupName = 'ItemPenis';
    if (groupName === 'ItemVulvaPiercings') groupName = 'ItemGlans';
  }

  return `Label-ChatOther-${groupName}-${activityName}`;
}

export function getActivityLabel(activity: ActivityName, group: AssetGroupItemName) {
  if (!activity || !group) return 'ACTIVITY NOT FOUND';

  const tag = getActivityLabelTag(activity, group);

  if (!tag) return 'ACTIVITY NOT FOUND';

  return ActivityDictionaryText(tag);
}

export function activityCanBeDoneOnSelf(activity: ActivityName | undefined, group: AssetGroupItemName | undefined): boolean {
  if (!activity || !group) return false;

  const activityData = AssetGetActivity(Player.AssetFamily, activity);

  if (!activityData || !activityData.TargetSelf) return false;

  const targets = typeof activityData.TargetSelf === 'boolean'
    ? activityData.Target
    : activityData.TargetSelf;

  return targets.includes(group);
}

export function getActivities(group: AssetItemGroup): Activity[] {
  if (!group) return [];

  const activities = AssetActivitiesForGroup('Female3DCG', group.Name, 'any');

  return activities
    .filter((a) => activityHasDictionaryText(getActivityLabelTag(a.Name, group.Name)));
}