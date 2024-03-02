from aiohttp import ClientSession

from hubspaceng.api import login


class ToggleDevice:
    device_id: str
    username: str
    password: str

    def __init__(
            self,
            device_id: str,
            username: str,
            password: str    
        ):
        self.device_id = device_id
        self.username = username
        self.password = password
    
    async def test(self):
        async with ClientSession() as websession:
            try:
                hubspace_api = await login(self.username, self.password, websession)

                devices = hubspace_api.devices
                device = devices[self.device_id]
                if device is None:
                    raise FileNotFoundError("Could not find requested device.")
            except Exception as ex:
                raise ConnectionError(f"Could not build hubspace toggle device!") from ex

    async def is_on(self) -> bool:
        async with ClientSession() as websession:
            try:
                hubspace_api = await login(self.username, self.password, websession)

                devices = hubspace_api.devices
                device = devices[self.device_id]
                if device is None:
                    raise FileNotFoundError("Could not find requested device.")
                return await device.is_on()
            except Exception as ex:
                raise ConnectionError(f"Could not build hubspace toggle device!") from ex

    async def toggle(self):
        async with ClientSession() as websession:
            try:
                hubspace_api = await login(self.username, self.password, websession)

                devices = hubspace_api.devices
                device = devices[self.device_id]
                if device is None:
                    raise FileNotFoundError("Could not find requested device.")
                if await device.is_on():
                    await device.turn_off()
                else:
                    await device.turn_on()
            except Exception as ex:
                raise ConnectionError(f"Could not build hubspace toggle device!") from ex
