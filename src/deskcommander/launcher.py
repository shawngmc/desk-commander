import asyncio
import json
import logging
import sys
import threading

import customtkinter

from deskcommander.connectors.hubspace import ToggleDevice 

logger = logging.getLogger('deskcommander')
logger.setLevel(logging.INFO)



class App:
    async def exec(self):
        print("Reading config...")
        config = None
        with open(sys.argv[1], "r", encoding = "utf-8") as config_file:
            config = json.loads(config_file.read())

        if not config:
            raise ValueError("No config provided; exiting.")
        
        self.window = Window(asyncio.get_event_loop(), config)
        await self.window.show();

class Window():
    def __init__(self, loop, config):
        self.loop = loop
        self.close = False
        self.config = config
        customtkinter.set_appearance_mode("dark")  # Modes: system (default), light, dark
        customtkinter.set_default_color_theme("green")  # Themes: blue (default), dark-blue, green
        self.root = customtkinter.CTk()
        # root.attributes("-fullscreen", True)
        self.root.geometry("1024x600")

        def on_closing():
            self.root.destroy()
            self.close = True
        self.root.protocol("WM_DELETE_WINDOW", on_closing)

        # Light Button
        light_toggle = ToggleDevice(self.config['hubspace']['light'], self.config['hubspace']['username'], self.config['hubspace']['password'])
        async def toggle_light():
            await light_toggle.toggle()
        async def check_light():
            return await light_toggle.is_on()
        button = ToggleButton(master=self.root, width=120, height=80, text="Toggle Light", loop=self.loop, toggle_command=toggle_light, check_command=check_light)
        button.place(relx=0.9, rely=0.2, anchor=customtkinter.CENTER)

        # Fan Button
        fan_toggle = ToggleDevice(self.config['hubspace']['fan'], self.config['hubspace']['username'], self.config['hubspace']['password'])
        async def toggle_fan():
            await fan_toggle.toggle()
        async def check_fan():
            return await fan_toggle.is_on()
        button = ToggleButton(master=self.root, width=120, height=80, text="Toggle Fan", loop=self.loop, toggle_command=toggle_fan, check_command=check_fan)
        button.place(relx=0.9, rely=0.4, anchor=customtkinter.CENTER)

    async def show(self):
        while not self.close:
            self.root.update()
            await asyncio.sleep(.1)

class ToggleButton(customtkinter.CTkButton):
    state: bool = True

    def __init__(
        self,
        loop = None,
        initialState:bool = None,
        toggle_command = None,
        check_command = None,
        *args,
        **kwargs
    ):
        self.loop = loop
        async def toggle():
            self.configure(state="disabled")
            await toggle_command()
            await asyncio.sleep(.1)
            await check()
            self.configure(state="normal")
        async def check():
            new_state = await check_command()
            self.updateState(new_state)
        super(ToggleButton, self).__init__(command=lambda: self.loop.create_task(toggle()), *args, **kwargs)
        if initialState is None:
            self.updateState(self.loop.create_task(check()))
        else:
            self.updateState(initialState)

    def updateState(self, state):
        # TKInter color chart: https://cs111.wellesley.edu/archive/cs111_fall14/public_html/labs/lab12/tkintercolor.html
        print(f"Updatestate {state}")
        if state:
            self.configure(fg_color='green2', hover_color='green3', text_color='black')
        else:
            self.configure(fg_color='red2', hover_color='red3', text_color='black')

def launch():
    asyncio.run(App().exec())

if __name__ == '__main__':
    launch()