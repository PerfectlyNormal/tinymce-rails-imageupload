class CreateImages < ActiveRecord::Migration
  def change
    create_table :images do |t|
      t.string     :alt,  default: ""
      t.string     :hint, default: ""
      t.attachment :file
      t.timestamps
    end
  end
end