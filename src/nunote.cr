require "./assets"
require "./notes_manager"
require "./server"
require "option_parser"

directory : Path = Path["./"]

OptionParser.parse do |parser|
  parser.banner = "Usage: nunote [arguments]"
  parser.on("-d DIR", "--directory DIR", "Directory of your notes. Defaults to current directory.") do |dir|
    directory = Path.new(dir)
  end
  parser.on("-h", "--help", "Show this help") do
    puts parser
    exit
  end
  parser.invalid_option do |flag|
    STDERR.puts "ERROR: #{flag} is not a valid option."
    STDERR.puts parser
    exit(1)
  end
end

notes = NotesManager.new(directory)

Server.start_server(notes)
