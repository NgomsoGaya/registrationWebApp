create table towns (
    id serial not null primary key, 
    town_code text not null,
    town text not null
);

create table registration_numbers(
    id serial not null primary key,
    registration_number varchar not null,
    town_id serial not null,
    foreign key (town_id) references towns(id)
)