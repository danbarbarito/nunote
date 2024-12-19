require "json"

class NotesManager
  @note_separator = "-" * 6
  @note_metadata_prefix = "+"

  struct Note
    include JSON::Serializable
    property index : Int32
    property content : String
    property tags : Array(String)
    property date : Time?

    def initialize(@index : Int32, @content : String, @tags : Array(String) = [] of String, @date : Time? = Time.local)
    end
  end

  def initialize(@notes_directory : Path)
    @notes_file = @notes_directory / "notes.md"
    @notes = [] of Note
    @tags = ([] of String).to_set

    setup
  end

  def notes : Array(Note)
    @notes
  end

  def tags : Set(String)
    @tags
  end

  def load_notes
    return unless File.exists?(@notes_file)

    content = File.read(@notes_file)
    note_blocks = content.split(@note_separator).map(&.strip).reject(&.empty?)

    tags = ([] of String).to_set

    notes = note_blocks.map_with_index do |block, index|
      note_content = ""
      note_tags = [] of String
      note_date = nil

      lines = block.split("\n")

      next_line_index = 0

      # Parse metadata
      lines[0..].each do |line|
        # Break if we reach the next metadata separator
        break if !line.starts_with?(@note_metadata_prefix)

        next_line_index += 1

        parts = line[@note_metadata_prefix.size..].split(":", 2)

        key = parts[0].strip
        value = parts[1..].join(":").strip

        if key == "date" && value
          begin
            # Parse the timestamp from the first line
            note_date = Time.parse(value, "%Y-%m-%d %H:%M:%S", Time::Location.local)
          rescue e : Time::Format::Error
          end
        end

        if key == "tags" && value
          note_tags = value.split(",").map(&.strip).reject(&.empty?)
          tags.concat(note_tags)
        end
      end

      # Join the remaining lines as the note content, excluding the date
      note_content = lines[next_line_index..].join("\n").strip

      Note.new(index, note_content, note_tags, note_date)
    end

    @tags = tags
    @notes = notes.reverse
  end

  def add_note(content : String, tags : Array(String) = [] of String)
    note = Note.new(@notes.size, sanitize_content(content), tags, Time.local)
    @notes.unshift(note)
    add_notes_to_file()
  end

  def update_note(index : Int32, content : String, tags : Array(String) = [] of String)
    @notes = @notes.map do |note|
      if note.index == index
        note.content = sanitize_content(content)
        note.tags = tags
      end
      note
    end
    add_notes_to_file()
  end

  def delete_note(index : Int32)
    @notes = @notes.select { |note| note.index != index }
    add_notes_to_file()
  end

  private def sanitize_content(content : String) : String
    content
      .gsub(@note_separator, "---")
      .strip
  end

  private def add_notes_to_file
    File.open(@notes_file, "w") do |file|
      @notes.reverse.each_with_index do |note, index|
        if date = note.date
          file.puts "#{@note_metadata_prefix} date: #{date.to_s}"
        end
        if note.tags.any?
          file.puts "#{@note_metadata_prefix} tags: #{note.tags.join(", ")}"
        end

        file.puts
        file.puts note.content

        file.puts "#{@note_separator}"
      end
    end
  end

  private def setup
    # Create notes directory if it doesn't exist
    if !Dir.exists?(@notes_directory)
      Dir.mkdir(@notes_directory)
    end

    # Create a new notes file if it doesn't exist
    if !File.exists?(@notes_file)
      File.open(@notes_file, "w") do |file|
        file.puts ""
      end
    end
  end
end
