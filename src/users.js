class User{
  constructor(json){
    this.id = json.id;
    this.username = json.username;
    this.name = json.name;
    this.description = json.description;
    this.host = json.host;
    if(this.host){
      this.acct = this.username + "@" + this.host;
    }else{
      this.acct = this.username;
    }
    this.avatarUrl = json.avatarUrl;
    this.avatarColor = json.avatarColor;
    this.isCat = json.isCat;
    this.isAdmin = json.isAdmin;
    this.isBot = json.isBot;
    this.url = json.url;
    this.createdAt = json.createdAt;
    this.updatedAt = json.updatedAt;
    this.bannerUrl = json.bannerUrl;
    this.bannerColor = json.bannerColor;
    this.isLocked = json.isLocked;
    this.isModerator = json.isModerator;
    this.isSilenced = json.isSilenced;
    this.isSuspeded = json.isSuspeded;
    this.userDescription = json.userDescription;
    this.location = json.location;
    this.birthday = json.birthday;
    //this.fields = json.fields;
    this.followersCount = json.followersCount;
    this.followingCount = json.followingCount;
    this.notesCount = json.notesCount;
    //this.pinnedNoteIds = json.pinnedNoteIds;
    //this.pinnedNotes = json.pinnedNoteIds;
    //this.pinnedPageId = json.pinnedPageId;
    //this.pinnedPage = json.pinnedPage;
    //this.twoFactorEnabled = json.twoFactorEnabled;
    //this.usePasswordLessLogin = json.usePasswordLessLogin;
    //this.securityKeys = json.securityKeys;
    this.twitter = json.twitter;
    this.github = json.github;
    this.discord = json.discord;
    //this.hasUnreadSpecifiedNotes = json.hasUnreadSpecifiedNotes;
    //this.hasUnreadMentions = json.hasUnreadMentions;
    this.avatarId = json.avatarId;
    this.bannerId = json.bannerId;
    //this.emojis = json.emojis;
  }
}

module.exports = User;
