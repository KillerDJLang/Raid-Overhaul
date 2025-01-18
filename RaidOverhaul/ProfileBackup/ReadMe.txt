To revert to the backed up profiles stored here:

-Locate the backup you want to use. It stores your 3 most recent backups at max per day. The first folder will be your profile ID and the next set of folders will be the date the backups were made which will contain the backup. The backup name will be your profile ID with a timestamp.
Ie => ProfileBackup/99a9aa9999999999999aaa99/2024-12-31/99a9aa9999999999999aaa99_16_10_27-backup.json

-Remove everything after and including the first "_" in the backup file name so you'll be left with just your profileID.json.

    For example, if the backup was "99a9aa9999999999999aaa99_16_10_27-backup.json" you want it to be "99a9aa9999999999999aaa99.json"

-Copy that file now that you've renamed it

-Navigate to your spt install/user/profiles

-Paste in the backup overwriting the profile already located there

\('_')/ \('_')/ \('_')/ \('_')/ \('_')/ \('_')/ \('_')/ \('_')/ \('_')/