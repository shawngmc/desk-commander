import serial

class SerialHandler:
    device_id: str
    baud_rate: int

    def __init__(
            self,
            device_id: str,
            baud_rate: int
        ):
        self.device_id = device_id
        self.baud_rate = baud_rate


    async def is_on(self) -> bool:
        pass
        # try:
        #     hubspace_api = await login(self.username, self.password, websession)

        #     devices = hubspace_api.devices
        #     device = devices[self.device_id]
        #     if device is None:
        #         raise FileNotFoundError("Could not find requested device.")
        #     return await device.is_on()
        # except Exception as ex:
        #     raise ConnectionError(f"Could not build hubspace toggle device!") from ex

    async def send_command(self, command, response_max=1000, timeout=1.5):
        with serial.Serial(self.device_id, self.baud_rate, timeout=timeout) as ser:
            ser.write(command)
            return ser.read(response_max)


class HdmiMatrix(SerialHandler):
    inputs: list[str]
    outputs: list[str]

    def __init__(
            self,
            config
        ):
            super().__init__(config['dev'], config['baud_rate'])
            self.inputs = config['inputs']
            self.outputs = config['outputs']

    def set_mapping(
            self,
            input: str,
            output: str
        ):
            # Get index of input
            try:
                input_idx = self.inputs.index(input)
            except ValueError as err:
                raise LookupError(f"Input {input} not recognized...") from err

            # Get index of host
            try:
                output_idx = self.outputs.index(output)
            except ValueError as err:
                raise LookupError(f"Output {output} not recognized...") from err
            
            # Send command
            # #video_d out# matrix=#
            command = f"#video_d out{output_idx} matrix={input_idx}"
            print(f"Sending command: {command}")
            response = self.send_command(command)
            print(f"Received response: {response}")

            # TODO: Check output
            
            pass
         
    def get_mapping(
            input: str
        ):
            # No obvious way to do this?
            pass

class UsbMatrix(SerialHandler):
    devices: list[str]
    hosts: list[str]

    def __init__(
            self,
            config
        ):
            super().__init__(config['dev'], config['baud_rate'])
            self.devices = config['devices']
            self.hosts = config['hosts']

    def set_mapping(
            self,
            device: str,
            host: str
        ):
            # Get index of device
            try:
                device_idx = self.devices.index(device)
            except ValueError as err:
                raise LookupError(f"Device {device} not recognized...") from err

            # Get index of host
            try:
                host_idx = self.hosts.index(host)
            except ValueError as err:
                raise LookupError(f"Host {host} not recognized...") from err

            # Send command
            # >SetUSB ##:## 
            # (device:host)
            command = f">SetUSB 0{device_idx}:0{host_idx}"
            print(f"Sending command: {command}")
            response = self.send_command(command)
            print(f"Received response: {response}")

            # TODO: Check output

            pass
         
    def get_mapping(
            self,
            device: str
        ):
            # Send command
            # >GetStatus
            command = f">GetStatus"
            print(f"Sending command: {command}")
            response = self.send_command(command)
            print(f"Received response: {response}")

            # TODO: Parse response



            pass