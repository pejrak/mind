# Glossary
*Fragment* - Smallest unit of data stored in memory (usually readable text)
*Memory* - Object containing all user data: Paths, trusts, fragments
*Path* - Array of basic nouns defining the meta channel in which fragments will be created as well as trusts established

# Goals
Inteface that allows a user to securely manage text fragments. The whole local "memory" structure (further Memory) should be transferrable.

Several goals are to be met:
## Transferability
- Memory can be extracted into a file
- Contents of the Memory file are encrypted by user's public key
- The Memory file can be downloaded and transfered as any file
- The Memory file can be loaded onto any other device (Needs decryption)
## Sharing
- The Fragments can be shared with other users via trusts
- Trusts are established on