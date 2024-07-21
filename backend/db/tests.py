from db.models import User,Crop
import unittest

class TestUserFunctions(unittest.TestCase):

    def test_user_functions(self):
        # Adding a user
        user_data = {
            "_id": "1",
            "username": "Mbunji Mohamed",
            "password": "this is everything",
            "email": "mbunjimo@gmail.com",
        }
        result = User.add_user(user_data)
        if result:
            print("Inserted ID:", result)
        else:
            print("Adding user Failed")

        # Getting a user
        result_user = User.get_user("1")
        if result_user:
            print("Retrieved user:", result_user)
        else:
            print("Either no user or failed to get user")

        # Updating a user
        update_data = {"email": "mombunji@gmail.com"}
        updated_user = User.update_user("1", update_data)
        if updated_user:
            print("Updated user:", updated_user)
        else:
            print("Failed to update user or no user")


        # Deleting a user
        deleted_user = User.delete_user("1")
        if deleted_user:
            print("Deleted User:", deleted_user)
        else:
            print("Failed to delete user or no user")

if __name__ == '__main__':
    # unittest.main()
    results = Crop.get_all_crops()

