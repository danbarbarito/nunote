require "kemal"
require "json"
require "./notes_manager"

module Server
  def self.start_server(notes_manager : NotesManager)
    # Matches GET "http://host:port/"
    get "/" do |env|
      render "src/views/index.ecr"
    end

    # Matches GET "http://host:port/*"
    get "/*" do |env|
      render "src/views/index.ecr"
    end

    # Matches GET "http://host:port/api/notes"
    get "/api/notes" do |env|
      env.response.content_type = "application/json"

      notes_manager.load_notes

      {
        notes: notes_manager.notes,
        tags:  notes_manager.tags,
      }.to_json
    end

    # Matches POST "http://host:port/api/notes"
    post "/api/notes" do |env|
      env.response.content_type = "application/json"

      content = env.params.json["content"].as(String)
      tags = env.params.json["tags"].as(Array(JSON::Any)).map { |tag| tag.to_s }

      notes_manager.add_note(content, tags)
      notes_manager.notes.to_json
    end

    # Matches PUT "http://host:port/api/notes/:id"
    put "/api/notes/:id" do |env|
      env.response.content_type = "application/json"

      id = env.params.url["id"].to_i
      content = env.params.json["content"].as(String)
      tags = env.params.json["tags"].as(Array(JSON::Any)).map { |tag| tag.to_s }

      notes_manager.update_note(id, content, tags)
      notes_manager.notes.to_json
    end

    # Matches DELETE "http://host:port/api/notes/:id"
    delete "/api/notes/:id" do |env|
      env.response.content_type = "application/json"

      id = env.params.url["id"].to_i

      notes_manager.delete_note(id)
      notes_manager.notes.to_json
    end

    # Creates a WebSocket handler.
    # Matches "ws://host:port/socket"
    ws "/socket" do |socket|
      socket.send "Hello from Kemal!"
    end

    Kemal.config.port = 3245

    Kemal.run
  end
end
