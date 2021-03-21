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
