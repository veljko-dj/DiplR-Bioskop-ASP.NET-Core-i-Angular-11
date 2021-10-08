using Microsoft.EntityFrameworkCore.Migrations;

namespace Bioskop_backend.Migrations
{
    public partial class izmenjenGlumac : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "picture",
                table: "Actors",
                newName: "pictureString");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "pictureString",
                table: "Actors",
                newName: "picture");
        }
    }
}
