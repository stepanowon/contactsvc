pm2 stop 0
rm /root/workspace/contactsvc/contacts.db
rm /root/workspace/contactsvc/public/photos/*
cp /root/workspace/contactsvc/temp_photow/* /root/workspace/contactsvc/public/photos/
pm2 start 0

