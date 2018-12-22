# ArtifactDraftMod
Mod file generator based on [LiquidHyped's draft tier list](https://drawtwo.gg/hypeds-draft-tier-list)

![image](https://user-images.githubusercontent.com/1154575/49697109-616b2480-fbee-11e8-84d9-a9598b1c5860.png)

![image](https://user-images.githubusercontent.com/1154575/49697130-9aa39480-fbee-11e8-8689-b40e4f5be764.png)


# How to use

Please download the following zip and extract into the Artifact resource folder. Please make sure to make a backup of the `card_set_*.txt` files just to be safe.

![image](https://user-images.githubusercontent.com/1154575/49694919-76838b80-fbcd-11e8-9976-bacb4ffeabc4.png)

Once you navigate into the game local files via Steam, it is in `dcg/resource`.

# How to Update the repository

First update your game files, and make sure the resource folder of your game resources file are up to date (you can click on the `verify integrity of game files` option from the Steam properties menu).

Make a copy of the original game files into the `original` directory. Then run `npm start` to run the mod code.

Verify the `generated` folder has the tiers added. Then open a pull request on GitHub. I will take care of the rest with releasing. Cheers!