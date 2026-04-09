# ensf-381-assignment4

b'$2b$12$IaWhApQhKwWgMfJX5rkiKONV0rCRiDwq/JgZ9SIJNBw8rEQvJdHAO'

## generating bcrypt hash
```python```
```
import bcrypt
password = "password123"
hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
print(hashed)```