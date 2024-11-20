"""For running on a production environment."""

from collage import create_app

app = create_app()

if __name__ == "__main__":
    print("starting app")
    app.run()