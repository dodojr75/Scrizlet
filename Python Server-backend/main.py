from flask import Blueprint, send_from_directory, abort
import os

GIF_FOLDER = os.path.join("static", "gifs")
gifs = Blueprint('gifs', __name__)

@gifs.route('/api/sign/<word>')
def get_gif(word):
    filename = f"{word.lower()}.gif"
    path = os.path.join(GIF_FOLDER, filename)
    if os.path.exists(path):
        return send_from_directory(GIF_FOLDER, filename)
    else:
        abort(404, f"Sign for '{word}' not found.")