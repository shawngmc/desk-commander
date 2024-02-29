import logging

import customtkinter

logger = logging.getLogger('deskcommander')
logger.setLevel(logging.INFO)

def launch():
    print("Launching...")

    customtkinter.set_appearance_mode("dark")  # Modes: system (default), light, dark
    customtkinter.set_default_color_theme("green")  # Themes: blue (default), dark-blue, green

    app = customtkinter.CTk()  # create CTk window like you do with the Tk window
    app.attributes("-fullscreen", True)
    app.geometry("400x240")

    def button_function():
        print("button pressed")

    # Use CTkButton instead of tkinter Button
    button = customtkinter.CTkButton(master=app, text="CTkButton", command=button_function)
    button.place(relx=0.5, rely=0.5, anchor=customtkinter.CENTER)

    button = customtkinter.CTkButton(master=app, text="CTkButton", command=button_function)
    # button.place(relx=0.25, rely=0.25, anchor=customtkinter.CENTER)
    button.pack()

    app.mainloop()

if __name__ == '__main__':
    launch()