# Glossary
*Fragment* - Smallest unit of data stored in memory (usually readable text)
*Memory* - Object containing all user data: Paths, trusts, fragments
*Path* - Array of basic nouns defining the meta channel in which fragments will be created as well as trusts established
*Trust* - Created between 2 users, a trustee and trustor

# Goals
Inteface that allows a user to securely manage text fragments. The whole local "memory" structure (further Memory) should be transferrable.

# Vision

# Goals


## Transferability
- Memory can be extracted into a file
- Contents of the Memory file are encrypted by user's public key
- The Memory file can be downloaded and transfered as any file
- The Memory file can be loaded onto any other browser instance or device running memory adapter (Needs decryption)
- Memory file can be extracted and uploaded to an external storage for retrieval, however encryption has to be ensured
## Sharing
- The Fragments can be shared with other users via trusts
- Trusts are established on a path, between 2 users, can be one-way or mutual
- Fragments can be created as private and personal
- Personal fragments won't be shared with the trustees
## Ownership
- Memory is owned by user and fragment transfer only occurs on established trusts, and can persisted by the service in encrypted form on explicitly selected storage
- Service authenticates the user to obtain user unique identifier (email)
- User profile is persisted on the service in order to save preferences and pointers for storage
