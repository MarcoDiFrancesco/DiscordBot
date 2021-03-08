# MPM Discord Bot

Discord bot for tournament creation

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
