BACKUP_SEED="false"

script_path=$( cd "$(dirname "${BASH_SOURCE}")" ; pwd -P )
echo "$script_path"

# PS3='Please enter the organization to run the script: '
# options=("default" "quit")
# select opt in "${options[@]}"
# do
#     case $opt in        
#         "default")
#             echo "Setting up superadmin for "$opt
#             break
#             ;;
#         "quit")
#             exit
#             break
#             ;;
#         *) echo invalid option;;
#     esac
# done


PS3='Do you want to delete all records in DB before proceeding: '
deloptions=("Insert Super Admin" "Delete Super Admin" "Quit")
select delopt in "${deloptions[@]}"
do
    case $delopt in        
        "Insert Super Admin")
            echo "Inserting Super Admin"$opt
            BACKUP_SEED="false"            
              mongo localhost:27017/node-pulse-gab mongo/default/superadmin.js            
            break
            ;;
        "Delete Super Admin")
            echo "Inserting Super Admin"$opt
            BACKUP_SEED="false"            
              mongo localhost:27017/node-pulse-gab mongo/default/cleanDB.js            
            break
            ;;
        "Quit")
            exit
            break
            ;;        
        *) echo invalid option;;
    esac
done

if [ "$BACKUP_SEED" = "true" ]
then
  SEED_LOCATION=$opt

  #create directory for seed data if does not exist.
  DIRECTORY="/opt/pulseServers/"
  DIRECTORY=$DIRECTORY$SEED_LOCATION
  echo $DIRECTORY
  if [ ! -d "$DIRECTORY" ]
  then
    echo "$DIRECTORY"
    mkdir "$DIRECTORY"
  fi
  cd "$DIRECTORY"

  #if directory exists move existing seeddata to backup
  DIR=$(date +%Y-%m-%d-%M-%s)
  if [ -d "$DIRECTORY" ]
  then
    mkdir $DIR
    mv "$DIRECTORY"/*.json $DIR
  fi

  cd "$script_path"
  #cp files from seeddata folder to seed endpoint input directory
  cp ../lib/static/"$SEED_LOCATION"/*.json "$DIRECTORY"


fi




