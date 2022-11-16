# MPM Bot

Discord bot of the MPM community used for Clash Of Clans tournament creation.

![https://i.imgur.com/GdzfxcM.png](https://i.imgur.com/GdzfxcM.png)

## Database structure

``` SQL
Clan:
- tag: str
- name: str
- representatives: [str]
- confirmed: bool

Player:
- tag : str
- name: str
- primary: boolean  // Primary or secondary account (default True)
- clan: Clan
```

## Setup

![image](https://user-images.githubusercontent.com/7454137/202128573-233015cd-2431-4916-a529-199c963d6e91.png)
